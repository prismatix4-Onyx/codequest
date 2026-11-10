import { Controller, Get, Param } from '@nestjs/common';

// Resilient loader for curriculum across monorepo deployments
let curriculumData: any[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  curriculumData = require('@codequest/python-curriculum').PYTHON_CURRICULUM || [];
} catch {
  curriculumData = [];
}

@Controller('curriculum')
export class CurriculumController {
  @Get()
  getCurriculum() {
    return curriculumData;
  }

  @Get(':conceptId')
  getConcept(@Param('conceptId') conceptId: string) {
    const concept = curriculumData.find((c) => c.id === conceptId);
    return concept || null;
  }
}
