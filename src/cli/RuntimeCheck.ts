export interface RuntimeCheckSuccess {
  success: true;
  isBun: true;
}

export interface RuntimeCheckFailure {
  success: false;
  isBun: false;
  error: string;
}

export type RuntimeCheckResult = RuntimeCheckSuccess | RuntimeCheckFailure;

export function checkBunRuntime(): RuntimeCheckResult {
  const isBun = typeof Bun !== 'undefined';

  if (isBun) {
    return {
      success: true,
      isBun: true,
    };
  }

  return {
    success: false,
    isBun: false,
    error: 'VybeSlides requires Bun runtime. Install: curl -fsSL https://bun.sh/install | bash',
  };
}
