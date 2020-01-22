// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application title: MMS Pro', () => {
    page.navigateTo();
    expect(page.getAppTitle()).toEqual('MMS Pro');
  });
});
