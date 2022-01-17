module.exports = {
    sessionNumber : 0,
    sessionStorage : {
        admin : 'adminsessionid',
    },
    getSession : function(username){
        return this.sessionStorage[username];
    },
    insertSession : function(username){
        if(this.getSession(username) === undefined){
            this.sessionStorage[username] = Math.random().toString(36).substr(2, 11) + this.sessionNumber.toString();
            this.sessionNumber++;
            console.log("Insert session with username : " + username + " / and session number : " + this.sessionStorage[username]);
            return;
        }
        console.error("Session with username is already exists.");
    },
    deleteSession : function(username){
        if(this.getSession(username) != undefined){
            console.log("Delete session with username : " + username + " / and session number : " + this.sessionStorage[username]);
            delete this.sessionStorage[username];
            return;
        }
        console.error("Session with username is not exists.");
    }
}