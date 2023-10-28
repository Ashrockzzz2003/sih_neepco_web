["Admin", "Buyer", "Consignee", "Payment Authority", "Vendor"]

export function RoleIDToRole(roleID) {
    switch (roleID) {
        case 0:
            return 'Admin';
        case 1:
            return 'Buyer';
        case 2:
            return 'Consignee';
        case 3:
            return 'Payment Authority';
        case 4:
            return 'Vendor';
        default:
            return 'COMPROMISED';
    }
}


export function RoleToRoleID(role) {
    switch (role) {
        case 'Admin':
            return 0;
        case 'Buyer':
            return 1;
        case 'Consignee':
            return 2;
        case 'Payment Authority':
            return 3;
        case 'Vendor':
            return 4;
        default:
            return -1;
    }
}

const BASE_URL = 'http://localhost:5000/api';
export const LOGIN_URL = `${BASE_URL}/login`;
export const REGISTER_URL = `${BASE_URL}/register`;
export const All_PROCUREMENTS_URL = `${BASE_URL}/getAllProcurements`;
export const ALL_VENDOR_URL = `${BASE_URL}/getVendors`;
export const CREATE_PROCUREMENT_URL = `${BASE_URL}/createProcurement`;
export const NEW_VENDOR_URL = `${BASE_URL}/newVendor`;
export const UPLOAD_PRC_URL = `${BASE_URL}/uploadPRC`;
export const UPLOAD_CRAC_URL = `${BASE_URL}/uploadCRAC`;
