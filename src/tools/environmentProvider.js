/**
 * @private
 * Holds environment information
 */
class EnvironmentProvider {
  constructor() {
    this.envs = {
      dev: '127.0.0.1',
      showcase: 'id.showcase',
    };
  }

  /**
   * Returns environment
   */
  get() {
    return this.environment;
  }

  /**
   * Sets environment
   * @param {object} environment
   */
  set(environment) {
    this.environment = environment;
  }

  /**
   * Clears environment
   */
  clear() {
    this.environment = undefined;
  }
}

const provider = new EnvironmentProvider();

export default provider;
