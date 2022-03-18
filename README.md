# Auth API (Prisma)

## What is this?
An authentication API with JWTs using Express, TypeScript, and Zod.

This version uses MongoDB/Mongoose/TypeGoose for the database. I also built the same app but using Postgres/Prisma. You can find that [here](https://github.com/c-ehrlich/auth-api-mongoose).

The MongoDB version is based on this video: [Tom Does Tech - Build an Authentication API with Node.js, TypeScript, Typegoose, ExpressJS & Zod](https://www.youtube.com/watch?v=qylGaki0JhY)

The main point was to have a well structured boilerplate with good structure, schema validation, etc. that I could base future projects on. While there are many ways it can be improved in the future, I'm happy with it for now as a starting point.

## What did I learn?
The main point of this was to get hands on with Prisma, so I learned a lot about how it's different from both Mongo/Mongoose and from other SQL ORMs I've used in the past - most importantly the Django ORM. The biggest pro of Prisma to me is that relations need to be defined in both directions (ie on each model), which I believe will make the models much easier to read for others in the future. So far the biggest downside I've found is that building pre/post save hooks is a bit clumsy compared to other ORMs, but it seems there is a lot of discussion about this in the Prisma repo.

## What is missing?
* The biggest issue is that there currently isn't a real mailserver - it's just using nodemailer to send the "emails" to the terminal. Other than that it's fully functional.
* The password reset codes are currently not time limited - in the future I would like to add a reset expiration data so that each code can only be used for 15 minutes, or whatever amount of time is deemed appropriate.
