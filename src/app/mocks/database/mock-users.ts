export interface MockUser {
  id: string;
  username: string;
  password: string;
  token: string;
}

export const USER_A: MockUser = {
  id: '3421',
  username: 'userA',
  password: 'userA123!',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InVzZXJBIiwiaWF0IjoxNTE2MjM5MDIyfQ.DMy2eDcDCn_ygQv6DLIFrPVnobSFYc9_30TqdCGL18o',
};

export const USER_ADMIN: MockUser = {
  id: '2390',
  username: 'admin',
  password: 'admin456!',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.T26Dm4buOBRdxNs58srk1l_N5y1Dxii9y-YMj-9J7mM',
};

const USERNAMES: Map<string, string> = new Map([
  [USER_A.id, USER_A.username],
  [USER_ADMIN.id, USER_ADMIN.username],
]);

// Mock function
export const getUsernameById = (id: string) => {
  return USERNAMES.get(id);
};

// Mock function
export const getIdByUsername = (username: string) => {
  if (username === USER_A.username) {
    return USER_A.id;
  } else if (username === USER_ADMIN.username) {
    return USER_ADMIN.id;
  }
  return '';
};
