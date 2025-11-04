import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";

const expect = chai.expect;
const urlServer = "http://localhost:8080";
const requester = supertest(urlServer);
