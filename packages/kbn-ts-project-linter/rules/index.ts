/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { forbiddenCompilerOptions } from './forbidden_compiler_options';
import { refPkgsIds } from './reference_pkg_ids';
import { requiredCompilerOptions } from './required_compiler_options';
import { validBaseConfig } from './valid_base_config';
import { requiredExcludes } from './required_excludes';
import { requiredFileSelectors } from './required_file_selectors';
import { referenceUsedPkgs } from './reference_used_pkgs';

export const PROJECT_LINTER_RULES = [
  forbiddenCompilerOptions,
  refPkgsIds,
  requiredCompilerOptions,
  validBaseConfig,
  requiredExcludes,
  requiredFileSelectors,
  referenceUsedPkgs,
];
