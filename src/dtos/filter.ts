export interface Rule {
  field: string;
  operator: string,
  value: string,
}

export interface Filter {
  combinator: string,
  rules: Rule[]
}