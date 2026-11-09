import campaignData from '../content/python/last-protocol/campaign.json';
import { StoryCampaignSchema, validateStoryGraph } from '../packages/story-schema/src';
import type { StoryCampaign } from '../packages/shared-types/src';

console.log('Testing campaign validation...');
try {
  const parsed = StoryCampaignSchema.parse(campaignData);
  console.log('Campaign schema parsed successfully:', parsed.title);

  const issues = validateStoryGraph(parsed as unknown as StoryCampaign);
  if (issues.length > 0) {
    console.error('Validation issues found:', issues);
    process.exit(1);
  } else {
    console.log('Validation passed with 0 issues! All scene linkages and graph paths are valid.');
  }
} catch (err) {
  console.error('Schema validation error:', err);
  process.exit(1);
}
