/*
 * Create and export configuration variables
 *
 */

// Container for all the requirements
var environments = {};

// Staging (default) env
environments.staging = {
	'port' : 3000,
	'envName' : 'staging',
};

// Production env
environments.production = {
	'port' : 5000,
	'envName' : 'production',
};

// Determine which env to export
var currentEnv = typeof(process.env.NODE_ENV) == 'string'
	? process.env.NODE_ENV.toLowerCase() 
	: '';
var envExport = typeof(environments[currentEnv]) == 'object'
	? environments[currentEnv]
	: environments.staging;


// Export module
module.exports = envExport;
