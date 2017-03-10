import { Angular2Demo1Page } from './app.po';

describe('angular2-demo1 App', function() {
  let page: Angular2Demo1Page;

  beforeEach(() => {
    page = new Angular2Demo1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
