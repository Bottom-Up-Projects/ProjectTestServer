var express = require('express');
var router = express.Router();
var viewsVariables = require('./../public/javascripts/variables');
var session = require('./../public/javascripts/session');
var fs = require('fs');
var multer = require('multer');
var uploadDir = __dirname + '/../uploads/';


router.get('/', (req, res, next) => {
    if(req.cookies.sessionid != undefined && req.cookies.sessionid == session.getSession(req.cookies.username)){
        var githubProjects = fs.readFileSync(__dirname + '/../public/files/githubProjects.json', 'utf8');
        githubProjects = JSON.parse(githubProjects);
        console.log(githubProjects);

        res.render('projectList', Object.assign(viewsVariables, {authorized: true, githubProjects : githubProjects}));
        return;
    }else{
        res.send(`<script>alert('Please login first!');location.href="/login"</script>`);
    } 
});

router.get('/:projectName', (req, res, next) => {
    if(req.cookies.sessionid != undefined && req.cookies.sessionid == session.getSession(req.cookies.username)){
        var path = __dirname + '/../public/files/githubProjects.json';
        var githubProjects = fs.readFileSync(path, 'utf8');
        githubProjects = JSON.parse(githubProjects);
        
        var project = githubProjects[req.params.projectName];
        console.log(project);
    
        res.render('projectPage', Object.assign(viewsVariables, {authorized: true, projectName : req.params.projectName, project : project}));    
    }else{
        res.send(`<script>alert('Please login first!');location.href="/login"</script>`);
    } 
})


router.post('/upload/:projectName', (req, res, next) => {    
    if(req.cookies.sessionid != undefined && req.cookies.sessionid == session.getSession(req.cookies.username)){
        // var githubProjects = fs.readFileSync(__dirname + '/../public/files/githubProjects.json', 'utf8');
        // githubProjects = JSON.parse(githubProjects);

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                var { projectNum, projectFile } = req.body;
                console.log(projectNum, projectFile);
                var path = uploadDir + `/${req.params.projectName}/${projectNum}`
                if(!fs.existsSync(path)){
                    fs.mkdirSync(path, { recursive: true });
                    console.log('create dir : ' + path);
                }

                cb(null, path);
            },
            filename: function (req, file, cb) {
                var fileName = `${req.cookies.username}_${Date.now()}_${file.originalname}`; 
                cb(null, fileName);
            }
        });

        var upload = multer({ 
            storage: storage, 
            fileFilter: function (req, file, cb) {
                var fileType = file.originalname.split('.')[-1];
                console.log(fileType);
                cb(null, true);
            }
        }).any();

        upload(req, res, function(err){
            if(err){
                console.log(err);
                return res.send(`<script>alert("Error!");history.back()</script>`);
            }    
            res.send(`<script>history.back()</script>`);
        })
    }else{
        res.send(`<script>alert('Please login first!');location.href="/login"</script>`);
    } 
});

module.exports = router;
