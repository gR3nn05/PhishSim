'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createGroup(formData: FormData) {
    const name = formData.get('name') as string
    const file = formData.get('csvFile') as File

    if (!name || !file) {
        throw new Error('Name and CSV file are required')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 1. Create Group
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
            name,
            user_id: user.id,
        })
        .select()
        .single()

    if (groupError || !group) {
        console.error('Error creating group:', groupError)
        throw new Error('Failed to create group')
    }

    // 2. Parse CSV and Insert Targets
    const text = await file.text()
    const lines = text.split('\n')
    const targets = []

    // Simple CSV parser: assumes "email,name" or just "email"
    // Skipping header if present (simple check: if first line has "email")
    const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const parts = line.split(',')
        const email = parts[0].trim()
        const targetName = parts[1] ? parts[1].trim() : ''

        if (email) {
            targets.push({
                group_id: group.id,
                email,
                name: targetName,
            })
        }
    }

    if (targets.length > 0) {
        const { error: targetsError } = await supabase
            .from('targets')
            .insert(targets)

        if (targetsError) {
            console.error('Error inserting targets:', targetsError)
            // In a real app, we might want to rollback the group creation
            throw new Error('Failed to upload targets')
        }
    }

    redirect('/dashboard/groups')
}

export async function deleteGroup(groupId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('groups').delete().eq('id', groupId)

    if (error) {
        throw new Error('Failed to delete group')
    }

    redirect('/dashboard/groups')
}

export async function updateGroup(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string

    if (!id || !name) {
        throw new Error('ID and Name are required')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('groups')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating group:', error)
        throw new Error('Failed to update group')
    }

    redirect('/dashboard/groups')
}
