import React from "react";

import { Schema } from "./Schema";
import { XHRRequestTable } from "./XHRRequest";
import { XHRResponseTable } from "./XHRResponse";

export namespace JJWAK {
  export namespace Page {
    export type Type = keyof JJWAK.Page.DataTable;
    export type DataTable = {
      //@jjwak-auto PAGE {
      Index: never;
      //@jjwak-auto PAGE }
    };
    export type Metadata = {
      titleArgs?: string[];
    };
    export interface Props<T extends JJWAK.Page.Type> {
      locale: string;
      page: T;
      path: string;
      title: string;

      data: JJWAK.Page.DataTable[T];
      version: string;

      metadata?: JJWAK.Page.Metadata;
      ssr?: boolean;
      children: React.ReactNode;
    }
  }
  export type ActionReceiverTable = Partial<{
    "example-action": Action;
  }>;
  export type ClientSettings = Pick<Schema.Settings["application"], never> & {
    languageSupport: Table<string>;
    endpoints: { [key in XHRType]: ["GET" | "POST", string] };
  };
  export type Clothes = {
    /**
     * `--dev`
     *
     * 개발 플래그 설정 여부.
     */
    development?: boolean;
    /**
     * `--query`
     *
     * 데이터베이스 쿼리 출력 여부.
     */
    queryLogging?: boolean;
  };
  export type ScheduleOptions = {
    /**
     * `true`인 경우 시작할 때 한 번 즉시 호출한다.
     */
    callAtStart: boolean;
    /**
     * `true`인 경우 정시에 호출된다. 가령 1시간마다 호출하려는 경우
     * 시작 시점과는 관계 없이 0시 정각, 1시 정각, …에 맞추어 호출된다.
     */
    punctual: boolean;
  };
}
export type XHRType = keyof XHRRequestTable | keyof XHRResponseTable;
