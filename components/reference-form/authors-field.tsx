"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { inputClass, secondaryButtonClass } from "../ui/field";

export function AuthorsField({ name, label }: { name: string; label: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, register } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-muted">{label}</span>
      {fields.length === 0 && (
        <p className="text-xs text-ink-muted">Nenhum autor adicionado ainda.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-ink-muted">
            Sobrenome
            <input
              className={inputClass}
              placeholder="Silva"
              {...register(`${name}.${index}.sobrenome`)}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs text-ink-muted">
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
            aria-label="Remover autor"
            className="flex h-10 shrink-0 items-center border border-rule px-3 text-xs text-ink-muted hover:border-red hover:text-red"
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ sobrenome: "", nome: "" })}
        className={`self-start ${secondaryButtonClass}`}
      >
        + Adicionar autor
      </button>
    </div>
  );
}
