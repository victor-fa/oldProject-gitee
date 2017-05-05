import { VocalWarriorWebsitePage } from './app.po';

describe('vocal-warrior-website App', () => {
  let page: VocalWarriorWebsitePage;

  beforeEach(() => {
    page = new VocalWarriorWebsitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
