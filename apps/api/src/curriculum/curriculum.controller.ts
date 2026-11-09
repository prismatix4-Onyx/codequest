import { Controller, Get, Param } from '@nestjs/common';
import { PYTHON_CURRICULUM } from '@codequest/python-curriculum';

@Controller('curriculum')
export class CurriculumController {
  @Get()
  getCurriculum() {
    return PYTHON_CURRICULUM;
  }

  @Get(':conceptId')
  getConcept(@Param('conceptId') conceptId: string) {
    const concept = PYTHON_CURRICULUM.find((c) => c.id === conceptId);
    return concept || null;
  }
}
