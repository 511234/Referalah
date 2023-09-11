"use client"

import React, { ChangeEvent, useState } from "react"
import { refererSortingOptions } from "@/utils/common/sorting/referer"

import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import useSearchPost from "@/hooks/api/post/useSearchPost"
import useDebounce from "@/hooks/common/useDebounce"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"

interface IRefererPostPageProps {}
const RefererPostPageTemplate: React.FunctionComponent<
  IRefererPostPageProps
> = () => {
  const [companyName, setCompanyName] = useState("")
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>()
  const [countryUuid, setCountryUuid] = useState<undefined | string>()
  const [cityUuid, setCityUuid] = useState<undefined | string>()
  const [industryUuid, setIndustryUuid] = useState<undefined | string>()
  const [yoeMin, setYoeMin] = useState<undefined | string>()
  const [yoeMax, setYoeMax] = useState<undefined | string>()
  const [sorting, setSorting] = useState(refererSortingOptions[0].value)
  const debouncedCompanyName = useDebounce(companyName, 800)

  const { industry: industryList } = useGetIndustryList()
  const { city: cityList } = useGetCityList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
  }

  const handleCountryChange = (value: string) => {
    setCountryUuid(value)
  }
  const handleProvinceChange = (value: string) => {
    setProvinceUuid(value)
  }
  const handleCityChange = (value: string) => {
    setCityUuid(value)
  }

  const handleIndustryChange = (value: string) => {
    setIndustryUuid(value)
  }

  const handleSortingChange = (value: string) => {
    setSorting(value)
  }

  const handleYeoMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoeMin(e.target.value)
  }

  const handleYeoMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoeMax(e.target.value)
  }

  const filterMeta = {
    companyName: debouncedCompanyName,
    cityUuid,
    countryUuid,
    industryUuid,
    provinceUuid,
    sorting,
    yoeMin,
    yoeMax,
  }

  const { data, fetchNextPage } = useSearchPost(sorting, filterMeta, "referer")
  console.log("datadata", data)
  const list = data
    ? (data?.pages.flatMap((d) => d) as ISearchPostResponse[])
    : []
  return (
    <div>
      <Input onChange={handleCompanyChange} placeholder="companyname" />
      <SearchPopover
        countryList={countryList}
        provinceList={provinceList}
        cityList={cityList}
        industryList={industryList}
        provinceUuid={provinceUuid}
        countryUuid={countryUuid}
        onCityChange={handleCityChange}
        onCountryChange={handleCountryChange}
        onProvinceChange={handleProvinceChange}
        onIndustryChange={handleIndustryChange}
        onSortingChange={handleSortingChange}
        onYeoMinChange={handleYeoMinChange}
        onYeoMaxChange={handleYeoMaxChange}
        currentSorting={sorting}
        currentCityUuid={cityUuid}
        currentCountryUuid={countryUuid}
        currentIndustryUuid={industryUuid}
        currentProvinceUuid={provinceUuid}
        currentYeoMax={yoeMax}
        currentYeoMin={yoeMin}
      />

      <BaseInfiniteScroll
        dataLength={list.length} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={
          (data &&
            data.pages &&
            data.pages[data.pages.length - 1].length !== 0)!
        }
      >
        {list.map((data) => {
          return (
            <ReferralCard
              jobTitle={data.job_title}
              username={data.user.username}
              photoUrl={data.user.avatar_url}
              province={data.province.cantonese_name}
              country={data.country.cantonese_name}
              city={data.city.cantonese_name}
              industry={data.industry.cantonese_name}
              companyName={data.company_name}
              description={data.description}
              socialMediaUrl={data.url}
              yearOfExperience={data.year_of_experience}
              uuid={data.uuid}
              key={data.uuid}
            />
          )
        })}
      </BaseInfiniteScroll>
    </div>
  )
}

export default RefererPostPageTemplate
