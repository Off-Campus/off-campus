import express from 'express';
import session from 'express-session';
import hbs from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


const localStrategy = require('passport-local').Strategy;
const app = express();

// Point to Environment Variables
dotenv.config({ path: './config/config.env' })

mongoose