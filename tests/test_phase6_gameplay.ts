import { SubmissionsService } from '../apps/api/src/submissions/submissions.service';
import { AuthService } from '../apps/api/src/auth/auth.service';
import { StoriesService } from '../apps/api/src/stories/stories.service';
import { JwtService } from '@nestjs/jwt';

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('CODEQUEST Phase 6: The Reactor Protocol — Test Suite');
  console.log('====================================================\n');

  // Initialize isolated mock services for test runner
  const jwtService = new JwtService({ secret: 'test-secret' });
  const authService = new AuthService(jwtService);
  const storiesService = new StoriesService();
  const submissionsService = new SubmissionsService(authService, storiesService);

  // Register test user session
  const guestSession = await authService.createGuestSession();
  const userId = guestSession.user.id;
  const missionId = 'mission-lp-01';

  let passedTests = 0;
  let totalTests = 8;

  // ----------------------------------------------------
  // TEST 1: Correct Code
  // ----------------------------------------------------
  console.log('--- TEST 1: Correct Code Submission ---');
  const correctCode = 'print("REACTOR INITIALIZED")\nprint("POWER: STABLE")';
  const res1 = await submissionsService.executeSubmission(userId, missionId, correctCode);
  console.log('Status:', res1.status);
  console.log('allPassed:', res1.allPassed);
  console.log('error:', res1.error);
  console.log('stderr:', res1.stderr);
  console.log('testResults count:', res1.testResults.length);
  console.log('feedback:', res1.feedback);

  if (res1.allPassed && res1.status === 'passed' && res1.testResults.every((t) => t.passed)) {
    console.log('✓ TEST 1 PASSED: Correct code verified all test cases.');
    passedTests++;
  } else {
    console.error('✗ TEST 1 FAILED');
  }

  // ----------------------------------------------------
  // TEST 2: Incorrect Output
  // ----------------------------------------------------
  console.log('\n--- TEST 2: Incorrect Output ---');
  const incorrectCode = 'print("HELLO WORLD")';
  const res2 = await submissionsService.executeSubmission(userId, missionId, incorrectCode);
  console.log('Status:', res2.status);
  console.log('allPassed:', res2.allPassed);

  if (!res2.allPassed && res2.status === 'failed') {
    console.log('✓ TEST 2 PASSED: Incorrect code correctly failed evaluation without false positives.');
    passedTests++;
  } else {
    console.error('✗ TEST 2 FAILED');
  }

  // ----------------------------------------------------
  // TEST 3: Syntax Error Handling
  // ----------------------------------------------------
  console.log('\n--- TEST 3: Syntax Error ---');
  const syntaxErrorCode = 'print("REACTOR INITIALIZED"';
  const res3 = await submissionsService.executeSubmission(userId, missionId, syntaxErrorCode);
  console.log('Status:', res3.status);
  console.log('allPassed:', res3.allPassed);
  console.log('error/stderr:', res3.error || res3.stderr);

  if (!res3.allPassed && (res3.status === 'syntax_error' || res3.status === 'failed')) {
    console.log('✓ TEST 3 PASSED: Syntax error detected and returned without server crash.');
    passedTests++;
  } else {
    console.error('✗ TEST 3 FAILED');
  }

  // ----------------------------------------------------
  // TEST 4: Runtime Error Handling
  // ----------------------------------------------------
  console.log('\n--- TEST 4: Runtime Error ---');
  const runtimeErrorCode = 'x = 10 / 0';
  const res4 = await submissionsService.executeSubmission(userId, missionId, runtimeErrorCode);
  console.log('Status:', res4.status);
  console.log('allPassed:', res4.allPassed);

  if (!res4.allPassed) {
    console.log('✓ TEST 4 PASSED: Runtime error safely isolated.');
    passedTests++;
  } else {
    console.error('✗ TEST 4 FAILED');
  }

  // ----------------------------------------------------
  // TEST 5: Repeated Submission & Idempotency
  // ----------------------------------------------------
  console.log('\n--- TEST 5: Repeated Submission & XP Idempotency ---');
  const userProfileBefore = await authService.getProfile(userId);
  const initialXp = userProfileBefore?.xp || 0;

  // Submit correct code again
  const res5 = await submissionsService.executeSubmission(userId, missionId, correctCode);
  const userProfileAfter = await authService.getProfile(userId);
  const finalXp = userProfileAfter?.xp || 0;

  console.log(`Initial XP: ${initialXp}, Final XP after repeat: ${finalXp}`);
  if (res5.allPassed && initialXp === finalXp) {
    console.log('✓ TEST 5 PASSED: Re-submitting completed mission is idempotent (no duplicate XP awarded).');
    passedTests++;
  } else {
    console.error('✗ TEST 5 FAILED: Duplicate XP was awarded.');
  }

  // ----------------------------------------------------
  // TEST 6: Progress Persistence & Story Tracking
  // ----------------------------------------------------
  console.log('\n--- TEST 6: Story Progress Tracking ---');
  const mission = submissionsService.getMission(missionId);
  const progress = storiesService.getProgress(userId, mission.storyId);
  console.log('Completed Missions in Progress:', progress.completedMissionIds);

  if (progress.completedMissionIds.includes(missionId)) {
    console.log('✓ TEST 6 PASSED: Mission ID successfully recorded in story progress store.');
    passedTests++;
  } else {
    console.error('✗ TEST 6 FAILED: Mission ID not found in progress.');
  }

  // ----------------------------------------------------
  // TEST 7: Hidden Test Protection
  // ----------------------------------------------------
  console.log('\n--- TEST 7: Hidden Test Case Masking ---');
  const hiddenTest = res1.testResults.find((t) => t.isHidden);
  console.log('Hidden test output in result:', hiddenTest?.expectedOutput);

  if (hiddenTest && hiddenTest.expectedOutput === '[HIDDEN TEST]') {
    console.log('✓ TEST 7 PASSED: Hidden test cases are masked from client results.');
    passedTests++;
  } else {
    console.error('✗ TEST 7 FAILED: Hidden test output leaked to client.');
  }

  // ----------------------------------------------------
  // TEST 8: Mission Definition Verification
  // ----------------------------------------------------
  console.log('\n--- TEST 8: Mission Metadata Verification ---');
  console.log('Mission Title:', mission.title);
  console.log('Mission Objective:', mission.objective);
  console.log('Starter Code Lines:', mission.starterCode.trim().split('\n').length);

  if (
    mission.title === 'Reactor Initialization' &&
    mission.objective.includes('REACTOR INITIALIZED') &&
    mission.objective.includes('POWER: STABLE')
  ) {
    console.log('✓ TEST 8 PASSED: Mission definition strictly adheres to Phase B specification.');
    passedTests++;
  } else {
    console.error('✗ TEST 8 FAILED: Mission metadata mismatch.');
  }

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedTests}/${totalTests} Tests Passed.`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase6Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
