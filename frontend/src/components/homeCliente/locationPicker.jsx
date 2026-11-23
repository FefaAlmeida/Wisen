"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./locationPicker.module.css";

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const locationKey = (location) => `${location.countryCode}:${location.stateId ?? "country"}`;

export function LocationPicker({ locations, value, onChange, disabled }) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(80);
  const items = useMemo(
    () =>
      locations
        .map((location) => ({
          ...location,
          key: locationKey(location),
          label: location.stateName
            ? `${location.stateName}, ${location.countryName}`
            : location.countryName,
          search: normalize(
            `${location.stateName ?? ""} ${location.countryName} ${location.countryCode}`,
          ),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "pt-BR")),
    [locations],
  );
  const selected = value ? (items.find((item) => item.key === locationKey(value)) ?? null) : null;
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matches = items.filter((item) => words.every((word) => item.search.includes(word)));

  return (
    <div className={styles.field}>
      <label htmlFor="onboarding-location">Localização</label>
      <Combobox.Root
        items={items}
        filteredItems={matches.slice(0, limit)}
        value={selected}
        onValueChange={(item) =>
          onChange(item ? { countryCode: item.countryCode, stateId: item.stateId } : null)
        }
        itemToStringLabel={(item) => item.label}
        isItemEqualToValue={(a, b) => a.key === b.key}
        onInputValueChange={(text, details) => {
          if (details.reason === "input-change") {
            setQuery(text);
            setLimit(80);
            if (selected) onChange(null);
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setQuery("");
            setLimit(80);
          }
        }}
        disabled={disabled}
        autoHighlight
        required
      >
        <Combobox.InputGroup
          className={styles.inputGroup}
          data-selected={Boolean(selected) || undefined}
        >
          {selected && (
            <Image
              className={styles.selectedFlag}
              src={`/flags/${selected.countryCode.toLowerCase()}.svg`}
              alt=""
              aria-hidden="true"
              width={24}
              height={18}
              unoptimized
            />
          )}
          <Combobox.Input
            id="onboarding-location"
            aria-label="Localização"
            placeholder="Busque seu estado ou região"
            className={styles.input}
            autoComplete="off"
          />
          <Combobox.Trigger className={styles.trigger} aria-label="Mostrar localizações">
            <ChevronDown size={16} />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={8} align="start" className={styles.positioner}>
            <Combobox.Popup className={styles.popup}>
              <Combobox.Empty className={styles.empty}>
                Nenhuma localização encontrada.
              </Combobox.Empty>
              <Combobox.List
                className={styles.list}
                onScroll={(event) => {
                  const list = event.currentTarget;
                  if (list.scrollHeight - list.scrollTop - list.clientHeight < 80)
                    setLimit((current) => current + 80);
                }}
              >
                {(item, index) => (
                  <Combobox.Item
                    key={item.key}
                    value={item}
                    index={index}
                    className={styles.option}
                  >
                    <Image
                      src={`/flags/${item.countryCode.toLowerCase()}.svg`}
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={18}
                      unoptimized
                    />
                    <span>{item.label}</span>
                    <Combobox.ItemIndicator className={styles.check}>
                      <Check size={16} />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}
