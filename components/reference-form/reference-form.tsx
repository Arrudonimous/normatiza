"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext, type FieldErrors } from "react-hook-form";
import { defaultValuesForType } from "@/lib/abnt/default-values";
import { MESES_ABREVIADOS } from "@/lib/abnt/months";
import { referenceFormSchema, type ReferenceFormValues } from "@/lib/abnt/schemas";
import { REFERENCE_TYPE_LABELS, type Reference, type ReferenceType } from "@/lib/abnt/types";
import { Field, inputClass, panelClass, primaryButtonClass } from "../ui/field";
import { AuthorsField } from "./authors-field";

const REFERENCE_TYPES = Object.keys(REFERENCE_TYPE_LABELS) as ReferenceType[];

export function ReferenceForm({
  onAdd,
}: {
  onAdd: (reference: Reference) => void;
}) {
  const methods = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceFormSchema),
    defaultValues: defaultValuesForType("livro"),
  });

  const { handleSubmit, watch, reset, clearErrors, formState } = methods;
  const type = watch("type");

  function changeType(newType: ReferenceType) {
    reset(defaultValuesForType(newType));
    clearErrors();
  }

  const onSubmit = (values: ReferenceFormValues) => {
    const id = crypto.randomUUID();
    onAdd({ ...values, id } as Reference);
    reset(defaultValuesForType(values.type));
    clearErrors();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-4 ${panelClass}`}
      >
        <Field label="Tipo de referência">
          <select
            className={inputClass}
            value={type}
            onChange={(e) => changeType(e.target.value as ReferenceType)}
          >
            {REFERENCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {REFERENCE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>

        {type === "livro" && <LivroFields />}
        {type === "artigo" && <ArtigoFields />}
        {type === "site" && <SiteFields />}
        {type === "capitulo" && <CapituloFields />}
        {type === "tcc" && <TccFields />}
        {type === "legislacao" && <LegislacaoFields />}

        <FormErrors errors={formState.errors} />

        <button type="submit" className={`self-start ${primaryButtonClass}`}>
          Adicionar referência
        </button>
      </form>
    </FormProvider>
  );

  function FormErrors({ errors }: { errors: FieldErrors<ReferenceFormValues> }) {
    const messages = Object.values(errors)
      .map((e) => (e && "message" in e ? (e.message as string) : undefined))
      .filter(Boolean);
    if (messages.length === 0) return null;
    return (
      <ul className="text-xs text-red">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    );
  }
}

function LivroFields() {
  const { register } = useFormCtx();
  return (
    <>
      <AuthorsField name="autores" label="Autores" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" className="col-span-2">
          <input className={inputClass} {...register("titulo")} />
        </Field>
        <Field label="Subtítulo (opcional)" className="col-span-2">
          <input className={inputClass} {...register("subtitulo")} />
        </Field>
        <Field label="Edição (ex.: 2)">
          <input className={inputClass} {...register("edicao")} />
        </Field>
        <Field label="Ano">
          <input className={inputClass} {...register("ano")} />
        </Field>
        <Field label="Cidade">
          <input className={inputClass} {...register("cidade")} />
        </Field>
        <Field label="Editora">
          <input className={inputClass} {...register("editora")} />
        </Field>
      </div>
    </>
  );
}

function ArtigoFields() {
  const { register } = useFormCtx();
  return (
    <>
      <AuthorsField name="autores" label="Autores" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título do artigo" className="col-span-2">
          <input className={inputClass} {...register("titulo")} />
        </Field>
        <Field label="Nome da revista" className="col-span-2">
          <input className={inputClass} {...register("revista")} />
        </Field>
        <Field label="Cidade (opcional)">
          <input className={inputClass} {...register("cidade")} />
        </Field>
        <Field label="Volume (opcional)">
          <input className={inputClass} {...register("volume")} />
        </Field>
        <Field label="Número (opcional)">
          <input className={inputClass} {...register("numero")} />
        </Field>
        <Field label="Mês (opcional)">
          <MonthSelect name="mes" />
        </Field>
        <Field label="Página inicial (opcional)">
          <input className={inputClass} {...register("paginaInicial")} />
        </Field>
        <Field label="Página final (opcional)">
          <input className={inputClass} {...register("paginaFinal")} />
        </Field>
        <Field label="Ano">
          <input className={inputClass} {...register("ano")} />
        </Field>
      </div>
    </>
  );
}

function SiteFields() {
  const { register } = useFormCtx();
  return (
    <>
      <AuthorsField name="autores" label="Autores ou organização responsável (opcional)" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título da página" className="col-span-2">
          <input className={inputClass} {...register("titulo")} />
        </Field>
        <Field label="Nome do site (opcional)">
          <input className={inputClass} {...register("nomeSite")} />
        </Field>
        <Field label="Ano de publicação (opcional)">
          <input className={inputClass} {...register("ano")} />
        </Field>
        <Field label="URL" className="col-span-2">
          <input className={inputClass} {...register("url")} />
        </Field>
        <Field label="Dia de acesso">
          <input className={inputClass} placeholder="10" {...register("diaAcesso")} />
        </Field>
        <Field label="Mês de acesso">
          <MonthSelect name="mesAcesso" />
        </Field>
        <Field label="Ano de acesso">
          <input className={inputClass} {...register("anoAcesso")} />
        </Field>
      </div>
    </>
  );
}

function CapituloFields() {
  const { register } = useFormCtx();
  return (
    <>
      <AuthorsField name="autores" label="Autores do capítulo" />
      <Field label="Título do capítulo">
        <input className={inputClass} {...register("tituloCapitulo")} />
      </Field>
      <AuthorsField name="autoresObra" label="Autores/organizadores da obra" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título da obra" className="col-span-2">
          <input className={inputClass} {...register("tituloObra")} />
        </Field>
        <Field label="Cidade">
          <input className={inputClass} {...register("cidade")} />
        </Field>
        <Field label="Editora">
          <input className={inputClass} {...register("editora")} />
        </Field>
        <Field label="Ano">
          <input className={inputClass} {...register("ano")} />
        </Field>
        <Field label="Página inicial (opcional)">
          <input className={inputClass} {...register("paginaInicial")} />
        </Field>
        <Field label="Página final (opcional)">
          <input className={inputClass} {...register("paginaFinal")} />
        </Field>
      </div>
    </>
  );
}

function TccFields() {
  const { register } = useFormCtx();
  return (
    <>
      <AuthorsField name="autores" label="Autor" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" className="col-span-2">
          <input className={inputClass} {...register("titulo")} />
        </Field>
        <Field label="Subtítulo (opcional)" className="col-span-2">
          <input className={inputClass} {...register("subtitulo")} />
        </Field>
        <Field label="Tipo">
          <select className={inputClass} {...register("tipo")}>
            <option value="TCC">TCC</option>
            <option value="Dissertação">Dissertação</option>
            <option value="Tese">Tese</option>
          </select>
        </Field>
        <Field label="Grau (ex.: Graduação)">
          <input className={inputClass} {...register("grau")} />
        </Field>
        <Field label="Curso">
          <input className={inputClass} {...register("curso")} />
        </Field>
        <Field label="Instituição">
          <input className={inputClass} {...register("instituicao")} />
        </Field>
        <Field label="Cidade">
          <input className={inputClass} {...register("cidade")} />
        </Field>
        <Field label="Número de folhas (opcional)">
          <input className={inputClass} {...register("numeroFolhas")} />
        </Field>
        <Field label="Ano">
          <input className={inputClass} {...register("ano")} />
        </Field>
      </div>
    </>
  );
}

function LegislacaoFields() {
  const { register } = useFormCtx();
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Jurisdição (ex.: BRASIL)">
        <input className={inputClass} {...register("jurisdicao")} />
      </Field>
      <Field label="Tipo de norma (ex.: Lei, Decreto)">
        <input className={inputClass} {...register("titulo")} />
      </Field>
      <Field label="Número">
        <input className={inputClass} {...register("numero")} />
      </Field>
      <Field label="Data (ex.: 14 de agosto de 2018)">
        <input className={inputClass} {...register("data")} />
      </Field>
      <Field label="Ementa (opcional)" className="col-span-2">
        <input className={inputClass} {...register("ementa")} />
      </Field>
      <Field label="URL (opcional)" className="col-span-2">
        <input className={inputClass} {...register("url")} />
      </Field>
      <Field label="Dia de acesso (opcional)">
        <input className={inputClass} {...register("diaAcesso")} />
      </Field>
      <Field label="Mês de acesso (opcional)">
        <MonthSelect name="mesAcesso" />
      </Field>
      <Field label="Ano de acesso (opcional)">
        <input className={inputClass} {...register("anoAcesso")} />
      </Field>
    </div>
  );
}

function MonthSelect({ name }: { name: string }) {
  const { register } = useFormCtx();
  return (
    <select className={inputClass} {...register(name)}>
      <option value="">-</option>
      {MESES_ABREVIADOS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}

function useFormCtx() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useFormContext<any>();
}
