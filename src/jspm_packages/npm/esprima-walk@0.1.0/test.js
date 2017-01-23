// Mocha globals
/* global describe it */

'use strict'


var expect = require( 'chai' ).expect

var walk = require( './esprima-walk' )

describe( 'esprima-walk', function () {


	it( 'should work', function () {
		
		var ast = {
			type: 'Program',
			body: [
				{
					type: 'VariableDeclaration',
					declarations: [
						{
							type: 'VariableDeclarator',
							id: {
								type: 'Identifier',
								name: 'answer'
							},
							init: {
								type: 'BinaryExpression',
								operator: '*',
								left: {
									type: 'Literal',
									value: 6,
									raw: '6'
								},
								right: {
									type: 'Literal',
									value: 7,
									raw: '7'
								}
							}
						}
					],
					kind: 'var'
				}
			]
		}

		var types = []

		walk( ast, function ( node ) {
			types.push( node.type )
		} )

		var expectedTypes = [
			'Program',
			'VariableDeclaration',
			'VariableDeclarator',
			'Identifier',
			'BinaryExpression',
			'Literal',
			'Literal'
		]

		expect( types ).to.deep.equal( expectedTypes )

	} )


} )
