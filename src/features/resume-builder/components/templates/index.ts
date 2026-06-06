import type { TemplateId } from '../../types/resume.types'
import { AccountantTemplate } from './AccountantTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { FresherClassicTemplate } from './FresherClassicTemplate'
import { FresherInternTemplate } from './FresherInternTemplate'
import { FresherModernTemplate } from './FresherModernTemplate'
import { FresherSimpleTemplate } from './FresherSimpleTemplate'
import { FresherTableTemplate } from './FresherTableTemplate'
import { ExecutiveNavyTemplate } from './ExecutiveNavyTemplate'
import { GraphicDesignerTemplate } from './GraphicDesignerTemplate'
import { GridInteriorTemplate } from './GridInteriorTemplate'
import { MarketingTimelineTemplate } from './MarketingTimelineTemplate'
import { ModernTemplate } from './ModernTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { StudentPurpleTemplate } from './StudentPurpleTemplate'
import { WebDesignerTemplate } from './WebDesignerTemplate'

export const templateComponents = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  webDesigner: WebDesignerTemplate,
  graphicDesigner: GraphicDesignerTemplate,
  marketingTimeline: MarketingTimelineTemplate,
  executiveNavy: ExecutiveNavyTemplate,
  gridInterior: GridInteriorTemplate,
  studentPurple: StudentPurpleTemplate,
  accountant: AccountantTemplate,
  fresherTable: FresherTableTemplate,
  fresherSimple: FresherSimpleTemplate,
  fresherModern: FresherModernTemplate,
  fresherClassic: FresherClassicTemplate,
  fresherIntern: FresherInternTemplate,
} as const

export function getTemplateComponent(id: TemplateId) {
  return templateComponents[id]
}
