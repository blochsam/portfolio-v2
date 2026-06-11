import React, { useEffect, Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { track } from '../utils/track';
import { CASE_STUDY_IDS } from '../data/projects';
import { usePageMeta } from '../utils/usePageMeta';
import { getCaseStudyMeta } from '../data/routeMeta';
import NextProject from './NextProject';

const CalNatCaseStudy = lazy(() => import('./CalNatCaseStudy'));
const PortfolioCaseStudy = lazy(() => import('./PortfolioCaseStudy'));
const DcadeCaseStudy = lazy(() => import('./DcadeCaseStudy'));
const ZooReportCaseStudy = lazy(() => import('./ZooReportCaseStudy'));
const SmartLockersCaseStudy = lazy(() => import('./SmartLockersCaseStudy'));
const FudgeCaseStudy = lazy(() => import('./FudgeCaseStudy'));
const LevelUpCaseStudy = lazy(() => import('./LevelUpCaseStudy'));
const SpaceUtilizationCaseStudy = lazy(() => import('./SpaceUtilizationCaseStudy'));

const CASE_STUDY_COMPONENTS: Record<string, React.LazyExoticComponent<React.FC>> = {
  'uc-calnat': CalNatCaseStudy,
  'portfolio': PortfolioCaseStudy,
  'dcade': DcadeCaseStudy,
  'zoo-report': ZooReportCaseStudy,
  'smart-lockers': SmartLockersCaseStudy,
  'fudge': FudgeCaseStudy,
  'level-up': LevelUpCaseStudy,
  'space-utilization': SpaceUtilizationCaseStudy,
};

const ProjectCaseStudy: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  usePageMeta(getCaseStudyMeta(projectId || ''));

  // Funnel instrumentation: which case studies actually get read
  useEffect(() => {
    if (projectId && CASE_STUDY_IDS.includes(projectId)) {
      track('case_study_view', { project: projectId });
    }
  }, [projectId]);

  const Component = projectId ? CASE_STUDY_COMPONENTS[projectId] : undefined;

  // No dead ends: unknown or write-up-pending slugs go back to the archive
  if (!projectId || !Component) return <Navigate to="/projects" replace />;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
      </div>
    }>
      <Component />
      <NextProject currentId={projectId} />
    </Suspense>
  );
};

export default ProjectCaseStudy;
