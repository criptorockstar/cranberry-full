"use client"

import * as React from "react"

export default function EditCategory({ params }: any) {
  const [showForm, setShowForm] = React.useState(false)
  return (
    <React.Fragment>
      {params.id}
    </React.Fragment>
  )
}
