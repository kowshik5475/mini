function SectionNode({ node, index }) {
  const hasChildren = node.children && node.children.length > 0
  return (
    <li className="section-tree__item">
      <div className="section-tree__row">
        {index !== undefined && <span className="section-tree__index">{index}</span>}
        <span className="section-tree__title">{node.title}</span>
      </div>
      {hasChildren && (
        <ul className="section-tree__children">
          {node.children.map((child, i) => (
            <SectionNode key={`${child.title}-${i}`} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

/** structure: nested tree [{ title, level, children: [...] }] */
export default function SectionTree({ structure }) {
  if (!structure || structure.length === 0) {
    return <p className="section-subtitle">No headings were detected in this document.</p>
  }

  return (
    <ul className="section-tree">
      {structure.map((node, i) => (
        <SectionNode key={`${node.title}-${i}`} node={node} index={String(i + 1).padStart(2, '0')} />
      ))}
    </ul>
  )
}
