/*
 * Create and export configuration variables
 *
 */

// Container for all the requirements
var environments = {};

// Staging (default) env
environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
};

// Production env
environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
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
