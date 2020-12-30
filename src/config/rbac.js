import { RBAC } from 'rbac';
import { getRoles, getPermissions, getGrants } from '../utils/rbac';
import chalk from 'chalk';

const rbac = new RBAC({
    roles: getRoles(),
    permissions: getPermissions(),
    grants: getGrants()
});

(async function () {
    await rbac.init();
})().then(() => console.log(chalk.blue(chalk.bold('RBAC initialized')))).catch(err => {
    console.log(chalk.bgRed(chalk.bold('RBAC initialization failed')));
    console.log(chalk.red(err));
    console.log(chalk.bgRed(chalk.bold(chalk.yellow("Resolve the issues and restart server again"))));
});

export default rbac;