# Auth API (Prisma)

## What is this?
An authentication API with JWTs using Express, TypeScript, and Zod.

This version uses MongoDB/Mongoose/TypeGoose for the database. I also built the same app but using Postgres/Prisma. You can find that [here](https://github.com/c-ehrlich/auth-api-mongoose).

The MongoDB version is based on this video: [Tom Does Tech - Build an Authentication API with Node.js, TypeScript, Typegoose, ExpressJS & Zod](https://www.youtube.com/watch?v=qylGaki0JhY)

## What did I learn?
The main point was to build a well structured boilerplate that I could base future projects on. I believe it was quite successful in that regard.

It was also my first time using Prisma, so I learned a lot about how it's different from other SQL ORMs I've used in the past - primarily the Django ORM. The biggest pro of Prisma to me is that relations need to be defined in both models, which I believe will make the models much easier to read for others in the future. So far the biggest downside I've found is that building pre/post save hooks is a bit clumsy compared to other ORMs, but it seems there is a lot of discussion about this in the Prisma repo.

## What is missing?
* The biggest issue is that there currently isn't a real mailserver - it's just using nodemailer to send the "emails" to the terminal. Other than that it's fully functional.
* The password reset codes are currently not time limited - in a real version I would add a reset expiration data so that each code can only be used for 15 minutes, or whatever amount of time is deemed appropriate.
