import coreUtils from "@opentripplanner/core-utils";
import { QuestionCircle } from "@styled-icons/fa-regular/QuestionCircle";
import React from "react";

import { QueryProps } from "./types";
import {
  accessModeIsWalkOnly,
  getCategoryModes,
  getNonTransitModes,
  getSelectedModes
} from "./util";
import * as S from "./styled";

const FeaturedOption = ({
  onQueryParamChange,
  queryParams,
  setFeaturedOption,
  supportedModes
}: QueryProps & { setFeaturedOption(option: string): void }) => {
  // No featured mode to show if walking to transit
  if (accessModeIsWalkOnly(queryParams?.mode)) return null;
  const nonTransitModes = getNonTransitModes(queryParams?.mode);
  const selectedCompanies = queryParams?.company?.split(",") || [];
  const selectedModes = getSelectedModes(queryParams);
  const option = nonTransitModes[0];
  const category = supportedModes.categories.find(c =>
    getCategoryModes(c).some(o => o === option)
  );
  const optionsAreCheckboxes = Boolean(category.mode);
  return (
    <S.FeaturedOptionContainer>
      <div>
        {category.options.map((o, index) => {
          const companyIsSelected = selectedCompanies.some(
            c => c === o.company
          );
          const modeIsSelected = selectedModes.some(m => m === o.mode);
          const isChecked = optionsAreCheckboxes
            ? companyIsSelected
            : o.company
            ? companyIsSelected && modeIsSelected
            : modeIsSelected;
          const selectOption = () => {
            let mode = selectedModes;
            let company = selectedCompanies;
            if (isChecked) {
              // Un-check the company box if dealing with checkboxes. Otherwise, do nothing.
              if (optionsAreCheckboxes)
                company = selectedCompanies.filter(c => c !== o.company);
              // Do nothing if already radio button is already checked.
              else return;
            } else {
              // if un checked, set/add company and set mode (FIXME: what about car/walk)
              if (o.mode) {
                mode = selectedModes
                  .filter(coreUtils.itinerary.isTransit)
                  .concat([o.mode]);
              }
              if (o.company) {
                company = optionsAreCheckboxes
                  ? selectedCompanies.concat([o.company])
                  : [o.company];
              }
            }
            onQueryParamChange({
              company: company.join(","),
              mode: mode.join(",")
            });
          };
          return (
            <S.OptionButton
              key={index}
              onClick={selectOption}
              selected={isChecked}
            >
              <S.OptionLabel>{o.label}</S.OptionLabel>
              <S.OptionIcon>
                {isChecked ? <S.GreenCheck /> : <S.UncheckedIcon />}
              </S.OptionIcon>
            </S.OptionButton>
          );
        })}
      </div>
      <div>
        <S.QuestionButton onClick={() => setFeaturedOption(option)}>
          <QuestionCircle />
        </S.QuestionButton>
        <S.Image src={category.image} />
      </div>
    </S.FeaturedOptionContainer>
  );
};

export default FeaturedOption;
