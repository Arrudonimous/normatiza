"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { inputClass } from "../ui/field";

export function AuthorsField({ name, label }: { name: string; label: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, register } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {fields.length === 0 && (
        <p className="text-xs text-slate-500">Nenhum autor adicionado ainda.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-slate-600">
            Sobrenome
            <input
              className={inputClass}
              placeholder="Silva"
              {...register(`${name}.${index}.sobrenome`)}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs text-slate-600">
            Nome
            <input
              className={inputClass}
              placeholder="João"
              {...register(`${name}.${index}.nome`)}
            />
          </label>
          <button
            type="button"
            onClick={() => remove(index)}
            className="h-9 rounded-md border border-slate-300 px-2 text-xs text-slate-600 hover:bg-slate-50"
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ sobrenome: "", nome: "" })}
        className="self-start rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        + Adicionar autor
      </button>
    </div>
  );
}
