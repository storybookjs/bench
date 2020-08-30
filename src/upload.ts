import { BigQuery } from '@google-cloud/bigquery';
import { sync as spawnSync } from 'cross-spawn';
import fs from 'fs';

const _gitHelper = (args: string[]): string => {
  const result = spawnSync('git', args, { stdio: 'pipe' });
  return result.output.join('\n').trim();
};

const gitBranch = () => _gitHelper(['rev-parse', '--abbrev-ref', 'HEAD']);
const gitCommit = () => _gitHelper(['rev-parse', 'HEAD']);

export const upload = async (
  { install, start, build, browse }: any,
  label: string
) => {
  console.log('uploading to label', label);
  const GCP_CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || '');

  const row = {
    branch: gitBranch(),
    commit: gitCommit(),
    timestamp: new Date().toISOString(),
    label,
    installTime: install.time.total,
    installSize: install.size.total,
    startManagerBuild: start.time.managerWebpack,
    startPreviewBuild: start.time.previewWebpack,
    startManagerRender: start.time.managerRender,
    startPreviewRender: start.time.previewRender,
    buildTime: build.time.build,
    browseManagerRender: browse.time.managerRender,
    browsePreviewRender: browse.time.previewRender,
    browseSizeTotal: browse.size.total,
    browseSizeManagerTotal: browse.size.manager.total,
    browseSizeManagerVendors: browse.size.manager.vendors,
    browseSizeManagerUiDll: browse.size.manager.uiDll,
    browseSizePreviewTotal: browse.size.preview.total,
    browseSizePreviewVendors: browse.size.preview.vendors,
    browseSizePreviewDocsDll: browse.size.preview.docsDll,
  };

  const bigquery = new BigQuery({
    projectId: GCP_CREDENTIALS.project_id,
    credentials: GCP_CREDENTIALS,
  });
  const dataset = bigquery.dataset('benchmark_results');
  const appTable = dataset.table('bench');

  await appTable.insert([row]);
};

export const main = async () => {
  const results = JSON.parse(fs.readFileSync('./bench.json').toString());
  try {
    await upload(results, 'bench');
  } catch (err) {
    console.log(err);
    (err.errors || []).map((sub: any) => console.log(sub));
  }
};
