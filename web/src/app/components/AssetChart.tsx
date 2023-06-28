"use client"

import { MutableRefObject, useRef } from "react"
import { fetcher } from "../utils"
import useSWR from "swr"
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription"
import { Chart, ChartComponentRef } from "./Chart"

export const AssetChartComponent = (props: { asset_id: string }) => {
  const chartRef = useRef() as MutableRefObject<ChartComponentRef>
  const { data: asset, mutate } = useSWR(
    `http://172.18.0.1:3000/assets/${props.asset_id}`,
    fetcher,
    {
      fallbackData: { id: props.asset_id, price: 0 },
    }
  )

  const { data: assetDaily } = useSWRSubscription(
    `http://172.18.0.1:3000/assets/${props.asset_id}/daily/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path)
      eventSource.addEventListener("asset-daily-created", async (event) => {
        console.log(event)
        const assetDailyCreated: AssetDaily = JSON.parse(event.data)
        chartRef.current.update({
          time: new Date(assetDailyCreated.date).getTime(),
          value: assetDailyCreated.price,
        })
        await mutate(
          { id: assetDailyCreated.id, price: assetDailyCreated.price },
          false
        )
        next(null, assetDailyCreated)
      })

      eventSource.onerror = (event) => {
        console.log(event)
        eventSource.close()
      }
      return () => {
        console.log("close event source")
        eventSource.close()
      }
    },
    {}
  )

  return (
    <Chart header={`${props.asset_id} - R$ ${asset.price}`} ref={chartRef} />
  )
}
