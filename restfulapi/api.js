const api = {}

api.hello = {
	get ({ setStatusCode }){
		setStatusCode(204)
	},
	post ({ req }){
		return {
			welcomeMessage: `Hello! Welcome to the API. You just called \`${req.endpoint}\`.`,
		}
	}
}

module.exports = api
