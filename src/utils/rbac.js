/**
 * RBAC Utilities
 */


/**
 * @returns roles
 */
export function getRoles() {
    return ['admin','user'];
}

/**
 * @returns modules
 */
export function getModules() {
    return ['admin', 'filetypes', 'keywords', 'mailchimp', 'transactions', 'user'];
}

let permissions = {
    'admin': [],
    'filetypes':['list'],
    'keywords':['list'],
    'mailchimp':['addContacts','sendTemplate'],
    'transactions':['createNew','get','getDetails','updateTransaction','updateStatus','delete'],
    'user':['create','getDetail','list']
}

/**
 * 
 * @param {String} [moduleName]  
 * @returns permissions
 */
export function getPermissions(moduleName) {
    if (typeof moduleName == "string") {
        let modules = getModules();
        moduleName = moduleName.toLowerCase();
        let index = modules.indexOf(moduleName);
        if (index == -1) return [];
        return permissions[moduleName];
    }
    return permissions;
}

let grants = {

    'admin': [
        'list_user','getDetail_user','list_filetypes','list_keywords','addContacts_mailchimp','sendTemplate_mailchimp','delete_transactions'
    ],
    'user': [
        'create_user','get_transactions','createNew_transactions','getDetails_transactions'
    ]
}

/**
 * 
 * @param {String} [role] 
 * @returns grants
 */
export function getGrants(role) {
    if (typeof role == 'string') {
        let roles = getRoles();
        role = role.toLowerCase();
        let index = roles.indexOf(role);
        if (index == -1) return [];
        return grants[role];
    }
    return grants;
}