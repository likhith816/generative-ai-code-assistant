
export interface CodeMetrics {
  lines_of_code: number;
  cyclomatic_complexity: number;
  maintainability_index: number;
  test_coverage: number;
}

export interface Dependencies {
  internal: string[];
  external: string[];
}

export interface AstSummary {
  classes: number;
  functions: number;
  complexity_hotspots: string[];
}

export interface FunctionDoc {
  function_name: string;
  signature: string;
  docstring: string;
  complexity_score: number;
  generated_examples?: string[];
}

export interface ApiDocumentation {
  openapi_version: string;
  endpoints_documented: number;
  schemas_generated: number;
  example_requests: boolean;
}

export interface ReadmeSections {
  overview: string;
  installation: string;
  usage: string;
  api_reference: string;
}

export interface DocumentationGenerated {
  function_docs: FunctionDoc[];
  api_documentation: ApiDocumentation;
  readme_sections: ReadmeSections;
}

export interface UnitTest {
  test_name: string;
  test_code: string;
  coverage_impact: string;
  edge_cases_covered: string[];
}

export interface TestsGenerated {
  unit_tests: UnitTest[];
  integration_tests: number;
  property_tests: number;
  total_coverage: number;
  mutation_score: number;
}

export interface CodeReference {
  file: string;
  lines: string;
  relevance_score: number;
}

export interface QueryResponse {
  query: string;
  response: string;
  code_references: CodeReference[];
  suggested_improvements: string[];
  confidence_score: number;
}

export interface CodeAnalysis {
  file_path: string;
  language: string;
  metrics: CodeMetrics;
  dependencies: Dependencies;
  ast_summary: AstSummary;
}

export interface CodeAnalysisResult {
  request_id: string;
  code_analysis: CodeAnalysis;
  documentation_generated: DocumentationGenerated;
  tests_generated: TestsGenerated;
  query_response: QueryResponse;
}

export type ChatEntry =
  | { type: 'user'; text: string }
  | { type: 'ai'; data: QueryResponse; isError?: boolean };