```markdown
# Midterm 1 Practice – Day 1 Coverage

| # | Topic / Skill | Question(s) | Notes |
|---|---------------|-------------|-------|
| 1 | **Pandas indexing & slicing** (Series vs. DataFrame, `.loc`, `.iloc`, boolean filtering, custom string index) | claw Q1, claude Q1 | Evaluates label vs positional lookups, chained filtering, returning scalars vs non-scalar outputs. |
| 2 | **GroupBy, aggregation, filter/head** | claw Q2, claude Q2 (parts d/e) | Counting groups, `.filter` returning original rows, `.head(1)` per group, grouped aggregation + pivot/pivot_table patterns. |
| 3 | **Regex + text extraction** | claw Q3, claude Q3 | `\d+`, capturing groups, fixed-length tokens, overlapping substring reasoning. |
| 4 | **EDA / Visualization reasoning** (plot choice, variable type) | claw Q4, claude Q4 | True/False on hist/KDE/box vs scatter; 2-variable plots (hexbin, contour, box-by-category). |
| 5 | **Sampling error & bias reasoning** | claw Q5, claude Q6 | Compare designs (intercepts vs email), identify chance error vs selection/non-response/response bias changes. |
| 6 | **Sampling distributions / proportions** (expectation, SE, chance error controls) | claw Q6 | Compute E[𝑝̂], SE(𝑝̂) for SRS, discuss convenience bias, ways to shrink chance error. |
| 7 | **Basic probability** (independent draws with replacement) | claw Q7 | Quick 0.4² calculation. |
| 8 | **Pivot tables / reshaping & aggregation by category** | claude Q2 (c–e) | Granularity, variable types, `groupby().sum().idxmax()`, `filter`, `pivot_table(values/index/columns/aggfunc/fill_value)`. |
| 9 | **Kernel density estimation intuition** | claude Q5 | Manual KDE evaluation + bandwidth interpretation. |
| 10 | **Survey design scenario** (Bear Transit) | claude Q6 | Identify sampling frame issues, non-response, weighting ideas. |
| 11 | **Transformations / MAE vs MSE / derivative intuition** | claude Q7 | Compare MAE vs MSE penalties, interpret partial derivatives sign, log-transform reasonableness. |

**Scope alignment:** All questions stay within Lectures 1–9 material (pandas, regex, plotting, sampling fundamentals), with claw Q6–Q7 flagged as “bonus/edge” (proportion SE & probability) and claude Q5–Q7 diving a bit deeper into KDE and loss/derivative intuition for extra practice.
```