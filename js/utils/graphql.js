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

    static async getUserData(userId, filter = 'all', sort = 'newest') {
        const progressConditions = {
            userId: { _eq: userId },
            eventId: { _eq: 75 },
        };

        switch (filter) {
            case 'passed':
                progressConditions.isDone = { _eq: true };
                progressConditions.grade = { _gte: 1 };
                break;
            case 'failed':
                progressConditions.isDone = { _eq: true };
                progressConditions.grade = { _lt: 1 };
                break;
            case 'in-progress':
                progressConditions.isDone = { _eq: false };
                break;
        }

        let orderBy;
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'grade-high':
                orderBy = { grade: 'desc' };
                break;
            case 'grade-low':
                orderBy = { grade: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        const query = `
            query GetUserData($userId: Int!, $progressWhere: progress_bool_exp, $progressOrderBy: [progress_order_by!]) {
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
                
                progress(
                    where: $progressWhere
                    order_by: $progressOrderBy
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
                
                skill: transaction(
                    where: {userId: {_eq: $userId}, type: {_like: "skill_%"}, eventId: {_eq: 75}}
                ) {
                    type
                    amount
                }
                
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
                
                upTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "up"}, eventId: {_eq: 75}}
                ) {
                    amount
                }
                
                downTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "down"}, eventId: {_eq: 75}}
                ) {
                    amount
                }
                
                audit_done: audit(
                    where: {auditorId: {_eq: $userId}, group: {eventId: {_eq: 75}}}
                ) {
                    id
                    grade
                    createdAt
                }
                
                audit_received: audit(
                    where: {group: {members: {userId: {_eq: $userId}}, eventId: {_eq: 75}}}
                ) {
                    id
                    grade
                    createdAt
                }
            }
        `;

        const variables = {
            userId,
            progressWhere: progressConditions,
            progressOrderBy: orderBy,
        };

        const result = await this.executeQuery(query, variables);
        
        const auditRatio = result.user[0]?.auditRatio || 0;
        const auditsDone = result.audit_done?.length || 0;
        const auditsReceived = result.audit_received?.length || 0;
        
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