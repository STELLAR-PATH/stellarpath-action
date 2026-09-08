import * as exec from '@actions/exec';

export async function runStellarPath(binaryPath: string, scanPath: string, format: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  let stdout = '';
  let stderr = '';

  const options: exec.ExecOptions = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
      stderr: (data: Buffer) => {
        stderr += data.toString();
      }
    },
    ignoreReturnCode: true
  };

  const exitCode = await exec.exec(binaryPath, ['scan', scanPath, '--format', format], options);

  return { exitCode, stdout, stderr };
}
