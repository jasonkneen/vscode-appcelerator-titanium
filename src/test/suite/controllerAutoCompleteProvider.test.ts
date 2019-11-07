import { expect } from 'chai';
import * as fs from 'fs';
import { after, before, describe, it } from 'mocha';
import * as path from 'path';
import * as sinon from 'sinon';
import * as tce from 'titanium-editor-commons';
import * as vscode from 'vscode';
import project from '../../project';

import { ControllerCompletionItemProvider } from '../../providers/completion/controllerCompletionItemProvider';

const fixturesPath = path.join(__dirname, '../../..', 'src', 'test', 'suite', 'fixtures');
const xmlFile = path.join(fixturesPath, 'sample.js');
const uri = vscode.Uri.file(xmlFile);
const rawData = fs.readFileSync(path.join(fixturesPath, 'data', 'completions.json'), 'utf8');
const completions = JSON.parse(rawData);

function testCompletion (position: vscode.Position) {
	return new Promise(resolve => {
		vscode.workspace.openTextDocument(uri).then(text => {
			const provider = new ControllerCompletionItemProvider();
			provider.provideCompletionItems(text, position).then(items => {
				return resolve(items);
			});
		});
	});
}

let sandbox;

describe('Controller suggestions', () => {

	before(async function () {
		this.timeout(5000);
		sandbox = sinon.createSandbox();
		sandbox.stub(project, 'sdk').returns(['8.1.0.GA']);
		sandbox.stub(tce.completion, 'loadCompletions').resolves(completions);
	});

	after(async function () {
		this.timeout(5000);
		sandbox.restore();

	});

	describe('Ti namespace suggestions', () => {

		it('Should provide tag suggestions', async () => {
			const position = new vscode.Position(0, 3); // Ti.
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(202);

			expect(suggestions[0].label).to.equal('Ti.Proxy');
			expect(suggestions[0].insertText).to.equal('Proxy');
			expect(suggestions[0].kind).to.equal(6);

			expect(suggestions[1].label).to.equal('Ti.Module');
			expect(suggestions[1].insertText).to.equal('Module');
			expect(suggestions[1].kind).to.equal(6);

			expect(suggestions[2].label).to.equal('Ti.UI.View');
			expect(suggestions[2].insertText).to.equal('View');
			expect(suggestions[2].kind).to.equal(6);

			expect(suggestions[3].label).to.equal('Ti.API');
			expect(suggestions[3].insertText).to.equal('API');
			expect(suggestions[3].kind).to.equal(6);

		});

		it('Should provide type suggestions', async () => {
			const position = new vscode.Position(1, 5); // Ti.UI
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(148);

			expect(suggestions[0].label).to.equal('Ti.UI.View');
			expect(suggestions[0].insertText).to.equal('View');
			expect(suggestions[0].kind).to.equal(6);

			expect(suggestions[1].label).to.equal('Ti.UI.ActivityIndicator');
			expect(suggestions[1].insertText).to.equal('ActivityIndicator');
			expect(suggestions[1].kind).to.equal(6);

			expect(suggestions[2].label).to.equal('Ti.UI.ActivityIndicatorStyle');
			expect(suggestions[2].insertText).to.equal('ActivityIndicatorStyle');
			expect(suggestions[2].kind).to.equal(6);

			expect(suggestions[3].label).to.equal('Ti.UI.AlertDialog');
			expect(suggestions[3].insertText).to.equal('AlertDialog');
			expect(suggestions[3].kind).to.equal(6);

		});

		it('Should provide property suggestions', async () => {
			const position = new vscode.Position(2, 28); // Ti.UI.ActivityIndicator.rota
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(3);

			expect(suggestions[0].label).to.equal('rotation');
			expect(suggestions[0].kind).to.equal(9);

			expect(suggestions[1].label).to.equal('rotationX');
			expect(suggestions[1].kind).to.equal(9);

			expect(suggestions[2].label).to.equal('rotationY');
			expect(suggestions[2].kind).to.equal(9);

		});
	});

	describe('Alloy namespace suggestions', () => {

		it('Should provide tag suggestions', async () => {
			const position = new vscode.Position(3, 6); // Alloy.
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(16);

			expect(suggestions[0].label).to.equal('Alloy.Controller');
			expect(suggestions[0].insertText).to.equal('Controller');
			expect(suggestions[0].kind).to.equal(6);

			expect(suggestions[1].label).to.equal('Alloy');
			expect(suggestions[1].insertText).to.equal('Alloy');
			expect(suggestions[1].kind).to.equal(6);

			expect(suggestions[2].label).to.equal('Alloy.Collections');
			expect(suggestions[2].insertText).to.equal('Collections');
			expect(suggestions[2].kind).to.equal(6);

			expect(suggestions[3].label).to.equal('Alloy.Controller.UI');
			expect(suggestions[3].insertText).to.equal('UI');
			expect(suggestions[3].kind).to.equal(6);

		});

		it('Should provide type suggestions', async () => {
			const position = new vscode.Position(4, 17); // Alloy.Controller.
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(14);

			expect(suggestions[0].label).to.equal('Alloy.Controller');
			expect(suggestions[0].insertText).to.equal('Controller');
			expect(suggestions[0].kind).to.equal(6);

			expect(suggestions[1].label).to.equal('Alloy.Controller.UI');
			expect(suggestions[1].insertText).to.equal('UI');
			expect(suggestions[1].kind).to.equal(6);

		});

		it('Should provide property suggestions', async () => {
			const position = new vscode.Position(5, 20); // Alloy.Controller.add
			const suggestions: any = await testCompletion(position);

			expect(suggestions.length).to.equal(2);

			expect(suggestions[0].label).to.equal('addClass');
			expect(suggestions[0].kind).to.equal(1);

			expect(suggestions[1].label).to.equal('addListener');
			expect(suggestions[1].kind).to.equal(1);

		});
	});
});