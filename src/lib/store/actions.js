export function newAccount(secret) {
  return {
    type: 'NEW_ACCOUNT',
    secret
  }
}
