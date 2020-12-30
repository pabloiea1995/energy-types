import { expect } from 'chai';
import { Comment } from '../../clients/schemas/comment.schema'

describe('Response to comment', ()=> {

    it('Generates response correctly', () => {

        const parentComment = new Comment("testAuthor", "test comment content", undefined, undefined,"test_Id" );

        const responseComment = new Comment("responseAuthor", "test comment response", undefined, undefined,"test_response_Id" );


        expect(parentComment).not.to.be.equal(null)
        expect(parentComment).not.to.be.equal(undefined)
        expect(parentComment.content).not.to.be.equal(undefined)
        expect(parentComment.content).not.to.be.equal(null)
        expect(parentComment.author).not.to.be.equal(null)
        expect(parentComment.author).not.to.be.equal(undefined)
        expect(parentComment.timestamp).not.to.be.equal(null)
        expect(parentComment.timestamp).not.to.be.equal(undefined)

        parentComment.response?.push(responseComment)
        

        

    
    })

})