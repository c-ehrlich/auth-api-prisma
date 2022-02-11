deploy the frontend from a subdirectory:
https://stackoverflow.com/questions/51918854/how-to-deploy-create-react-app-to-gh-pages-subfolder

deploy the backend from a subdirectory:
https://stackoverflow.com/questions/39197334/automated-heroku-deploy-from-subfolder
https://jtway.co/deploying-subdirectory-projects-to-heroku-f31ed65f3f2

nodemailer heroku
oauth https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
older method https://jay315.medium.com/sending-email-using-express-js-with-nodemailer-in-heroku-71741f29463c

TODO:
Make the password reset codes time limited ... add an reset expiration date to the user when a reset code is created (now + 1 hour or something), then when the user attempts to reset the password, check if that date has already passed
