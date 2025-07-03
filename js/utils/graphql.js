import { AuthManager } from './auth.js';

export class GraphQLClient {
    static GRAPHQL_ENDPOINT = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';

    static async executeQuery(query, variables = {}) {
        const token = AuthManager.getAuthToken();
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(this.GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors.map(error => error.message).join(', '));
        }

        return result.data;
    }

    static async getUserData(userId) {
        const query = `
            query GetUserData($userId: Int!) {
                user(where: {id: {_eq: $userId}}) {
                    id
                    login
                    attrs
                    campus
                    createdAt
                    updatedAt
                    auditRatio
                    events(where: { eventId: { _eq: 75 } }) {
                        level
                    }
                }
                
                # XP transactions for event 75 only
                transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "xp"}, eventId: {_eq: 75}}
                    order_by: {createdAt: asc}
                ) {
                    id
                    type
                    amount
                    createdAt
                    path
                    objectId
                    eventId
                    object {
                        name
                        type
                    }
                }
                
                # Progress for event 75 only
                progress(
                    where: {userId: {_eq: $userId}, eventId: {_eq: 75}}
                    order_by: {createdAt: desc}
                ) {
                    id
                    userId
                    objectId
                    grade
                    createdAt
                    updatedAt
                    path
                    isDone
                    eventId
                    object {
                        id
                        name
                        type
                    }
                }
                
                # Results for event 75 only
                result(
                    where: {userId: {_eq: $userId}, eventId: {_eq: 75}}
                    order_by: {createdAt: desc}
                ) {
                    id
                    userId
                    grade
                    createdAt
                    updatedAt
                    objectId
                    path
                    eventId
                    object {
                        name
                        type
                    }
                }
                
                # Skills transactions for event 75 only
                skill: transaction(
                    where: {userId: {_eq: $userId}, type: {_like: "skill_%"}, eventId: {_eq: 75}}
                ) {
                    type
                    amount
                }
                
                # Skill types aggregate for better performance
                skillTypes: transaction_aggregate(
                    distinct_on: [type]
                    where: {userId: {_eq: $userId}, type: {_nin: ["xp", "level", "up", "down"]}, eventId: {_eq: 75}}
                    order_by: [{type: asc}, {amount: desc}]
                ) {
                    nodes {
                        type
                        amount
                    }
                }
                
                # Up transactions (audits done) for event 75 only
                upTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "up"}, eventId: {_eq: 75}}
                ) {
                    amount
                }
                
                # Down transactions (audits received) for event 75 only
                downTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "down"}, eventId: {_eq: 75}}
                ) {
                    amount
                }
                
                # Audit done count for event 75
                audit_done: audit(
                    where: {auditorId: {_eq: $userId}, group: {eventId: {_eq: 75}}}
                ) {
                    id
                    grade
                    createdAt
                }
                
                # Audit received count for event 75
                audit_received: audit(
                    where: {group: {members: {userId: {_eq: $userId}}, eventId: {_eq: 75}}}
                ) {
                    id
                    grade
                    createdAt
                }
            }
        `;

        const result = await this.executeQuery(query, { userId });
        
        // Get audit ratio directly from user object (already calculated by GraphQL API)
        const auditRatio = result.user[0]?.auditRatio || 0;
        const auditsDone = result.audit_done?.length || 0;
        const auditsReceived = result.audit_received?.length || 0;
        
        // Also calculate from up/down transactions for chart display
        const upTransactionTotal = result.upTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
        const downTransactionTotal = result.downTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
        
        return {
            user: result.user,
            transaction: result.transaction,
            progress: result.progress,
            result: result.result,
            skill: result.skill || [],
            skillTypes: result.skillTypes?.nodes || [],
            upTransactions: result.upTransactions || [],
            downTransactions: result.downTransactions || [],
            auditRatio: auditRatio,
            auditsDone: auditsDone,
            auditsReceived: auditsReceived,
            upTransactionTotal: upTransactionTotal,
            downTransactionTotal: downTransactionTotal,
        };
    }
}