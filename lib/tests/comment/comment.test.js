"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const comment_schema_1 = require("../../clients/schemas/comment.schema");
describe('Response to comment', () => {
    it('Generates response correctly', () => {
        var _a;
        const parentComment = new comment_schema_1.Comment("testAuthor", "test comment content", undefined, undefined, "test_Id");
        const responseComment = new comment_schema_1.Comment("responseAuthor", "test comment response", undefined, undefined, "test_response_Id");
        chai_1.expect(parentComment).not.to.be.equal(null);
        chai_1.expect(parentComment).not.to.be.equal(undefined);
        chai_1.expect(parentComment.content).not.to.be.equal(undefined);
        chai_1.expect(parentComment.content).not.to.be.equal(null);
        chai_1.expect(parentComment.author).not.to.be.equal(null);
        chai_1.expect(parentComment.author).not.to.be.equal(undefined);
        chai_1.expect(parentComment.timestamp).not.to.be.equal(null);
        chai_1.expect(parentComment.timestamp).not.to.be.equal(undefined);
        (_a = parentComment.response) === null || _a === void 0 ? void 0 : _a.push(responseComment);
    });
});
