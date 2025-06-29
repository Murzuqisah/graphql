import { AuthManager } from "./auth.js";

export class Client {
  static GRAPHQL_API =
    "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql";

  static async query(query, variables = {}) {
    const token = AuthManager.getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch(this.GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(
        `GraphQL error: ${result.errors.map((e) => e.message).join(", ")}`
      );
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
                }
                
                transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "xp"}}
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
                    where: {userId: {_eq: $userId}}
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
                
                result(
                    where: {userId: {_eq: $userId}}
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
                    where: {userId: {_eq: $userId}, type: {_like: "skill_%"}}
                ) {
                    type
                    amount
                }
                
                upTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "up"}}
                ) {
                    amount
                }
                
                downTransactions: transaction(
                    where: {userId: {_eq: $userId}, type: {_eq: "down"}}
                ) {
                    amount
                }
                
                audit_done: audit(
                    where: {auditorId: {_eq: $userId}}
                ) {
                    id
                    grade
                    createdAt
                }
                
                audit_received: audit(
                    where: {group: {members: {userId: {_eq: $userId}}}}
                ) {
                    id
                    grade
                    createdAt
                }
            }
        `;
  }
}
