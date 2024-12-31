const roles = {
    admin: [],
    waiter: [
        "manage_tables",  
        "view_tables",    
        "manage_orders",   
        "view_orders",     
    ],
    chef: [
        "view_orders",      
        "manage_orders",    
        "view_dishes",   
        "view_inventory"
    ],
    cashier: [
        "view_orders",     
        "manage_payments"
    ],
};

export function checkPermission(action) {
    return (req, res, next) => {
        const userRole = res.locals.user.role;

        // Grant all permissions to admin
        if (userRole === "admin") {
            return next(); // Admin bypasses all permission checks
        }

        // Check if the role has the specific action permission
        if (roles[userRole] && roles[userRole].includes(action)) {
            return next(); // User has the required permission
        }

        // Deny access if no permission
        res.status(403).render('403', { title: 'Forbidden' });
    };
}
