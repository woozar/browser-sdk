import BrowserSDK from '../src/index';
import userManagerProvider from '../src/tools/userManagerProvider';
import environmentProvider from '../src/tools/environmentProvider';

describe('browser module', () => {
  describe('constructor', () => {
    it('throws error if constructor options are invalid', () => {
      expect(() => new BrowserSDK()).toThrowError();
      expect(
        () => new BrowserSDK({ baseUrl: 'int.olt-dev.io', realm: 'IoT' })
      ).toThrowError();
      expect(() => new BrowserSDK({ clientId: 'abcdefg' })).toThrowError();
    });

    it('creates user manager instance', () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      expect(sdk.manager.settings).toBeDefined();
    });

    it('sets userManagerProvider', () => {
      // eslint-disable-next-line no-unused-vars
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      }); // eslint-disable-line no-unused-vars
      expect(userManagerProvider.get()).toBeDefined();
    });

    it('sets EnvironmentProvider', () => {
      // eslint-disable-next-line no-unused-vars
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      }); // eslint-disable-line no-unused-vars
      expect(environmentProvider.get()).toBeDefined();
    });
  });

  describe('login', () => {
    it('calls signinRedirect method', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.signinRedirect = jest.fn();
      await sdk.login();
      expect(sdk.manager.signinRedirect).toHaveBeenCalledTimes(1);
    });

    it('calls signinRedirect method with loginHint if passed as option', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.signinRedirect = jest.fn();
      const loginHint = 's@n.se';
      await sdk.login({ loginHint });
      expect(sdk.manager.signinRedirect).toHaveBeenCalledTimes(1);
      expect(sdk.manager.signinRedirect).toHaveBeenCalledWith({
        login_hint: loginHint,
      });
    });

    it('dont call signinRedirect method when user is authorized', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.getUser = jest
        .fn()
        .mockResolvedValue({ access_token: 'abcdefg' });
      sdk.manager.signinRedirect = jest.fn();
      await sdk.login();
      expect(sdk.manager.signinRedirect).toHaveBeenCalledTimes(0);
    });
  });

  describe('logout', () => {
    it('should call signoutRedirect method', () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.signoutRedirect = jest.fn();
      sdk.logout();
      expect(sdk.manager.signoutRedirect).toHaveBeenCalledTimes(1);
    });

    it('clears userManagerProvider', () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      }); // eslint-disable-line no-unused-vars
      sdk.logout();
      expect(userManagerProvider.get()).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('returns promise with user object', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      const userMock = { access_token: 'abcdefg' };
      sdk.manager.getUser = jest.fn().mockResolvedValue(userMock);
      const response = await sdk.getCurrentUser();
      expect(response).toEqual(userMock);
    });
  });

  describe('changeTenant', () => {
    it('should call signInRedirect if no tenantId is provided', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.signinRedirect = jest.fn().mockResolvedValue(true);
      const response = await sdk.changeTenant();
      expect(response).toEqual(true);
    });

    it('should call changeTenant if no tenantId is provided', async () => {
      const sdk = new BrowserSDK({
        baseUrl: 'int.olt-dev.io',
        realm: 'IoT',
        clientId: 'abcdefg',
      });
      sdk.manager.changeTenant = jest.fn().mockResolvedValue(true);
      const response = await sdk.changeTenant('foo');
      expect(response).toEqual(true);
      expect(sdk.manager.changeTenant).toHaveBeenCalledWith('foo');
    });
  });
});
