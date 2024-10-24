"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators"); // Adjust path if needed
describe('Request Validators', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        next = jest.fn();
    });
    describe('registerValidator', () => {
        it('should pass validation with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                age: 25,
                city: 'Test City'
            };
            yield (0, validators_1.registerValidator)(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        }));
        it('should fail validation with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'invalid-email',
                password: 'password123',
                name: 'Test User',
                age: 25,
                city: 'Test City'
            };
            yield (0, validators_1.registerValidator)(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ msg: 'Invalid email address' })
                ])
            }));
        }));
        // Add more test cases for other invalid data scenarios
        // (e.g., short password, missing name, invalid age, missing city)
    });
    describe('updateUserValidator', () => {
        it('should pass validation with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'test@example.com',
                age: 30
            };
            yield (0, validators_1.updateUserValidator)(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        }));
        it('should fail validation with invalid email (even if optional)', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'invalid-email'
            };
            yield (0, validators_1.updateUserValidator)(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ msg: 'Invalid email address' })
                ])
            }));
        }));
        // Add more test cases for other invalid data scenarios
        // (e.g., short password, invalid age)
    });
});
