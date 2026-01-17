import { describe, it, expect } from 'vitest';
import { Logger, getLogger } from './Logger';

describe('Logger', () => {
  describe('construction', () => {
    it('should create logger with namespace', () => {
      const logger = new Logger('test-namespace');

      expect(logger.namespace).toBe('test-namespace');
    });

    it('should start enabled by default', () => {
      const logger = new Logger('test');

      expect(logger.enabled).toBe(true);
    });
  });

  describe('enable/disable', () => {
    it('should create new logger with enabled false', () => {
      const logger = new Logger('test');
      const disabled = logger.withEnabled(false);

      expect(disabled.enabled).toBe(false);
    });

    it('should create new logger with enabled true', () => {
      const logger = new Logger('test', false);
      const enabled = logger.withEnabled(true);

      expect(enabled.enabled).toBe(true);
    });
  });

  describe('log methods', () => {
    it('should expose debug method', () => {
      const logger = new Logger('test');

      expect(typeof logger.debug).toBe('function');
    });

    it('should expose log method', () => {
      const logger = new Logger('test');

      expect(typeof logger.log).toBe('function');
    });

    it('should expose warn method', () => {
      const logger = new Logger('test');

      expect(typeof logger.warn).toBe('function');
    });

    it('should expose error method', () => {
      const logger = new Logger('test');

      expect(typeof logger.error).toBe('function');
    });
  });
});

describe('getLogger', () => {
  it('should return logger for namespace', () => {
    const logger = getLogger('singleton-test');

    expect(logger.namespace).toBe('singleton-test');
  });

  it('should return logger with same namespace for same input', () => {
    const logger1 = getLogger('same-namespace');
    const logger2 = getLogger('same-namespace');

    expect(logger1.namespace).toBe(logger2.namespace);
  });

  it('should return different instances for different namespaces', () => {
    const logger1 = getLogger('namespace-a');
    const logger2 = getLogger('namespace-b');

    expect(logger1).not.toBe(logger2);
  });
});
