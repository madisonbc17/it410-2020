<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>
                Big Calendar
                <small>React gcal/outlook like calendar component</small>
            </div>
        </div>
        <div class="calendar-app">
            <div class="row">
                <div class="col-xl-3 col-lg-4">
                    <div class="row">
                        <div class="col-lg-12 col-md-6 col-12">
                            <div class="card card-default" title="">
                                <div class="card-header">
                                    <h4 class="card-title">Draggable Events</h4>
                                </div>
                                <div class="card-body">
                                    <div class="external-events" ref="externalEventsList">
                                        <div
                                            v-for="ev in externalEvents"
                                            :class="'fce-event bg-' + ev.color"
                                        >
                                            {{ ev.name }}
                                        </div>
                                    </div>
                                    <div class="custom-control custom-checkbox mt-3">
                                        <input
                                            class="custom-control-input"
                                            id="drop-remove"
                                            type="checkbox"
                                            v-model="evRemoveOnDrop"
                                        />
                                        <label class="custom-control-label" for="drop-remove"
                                            >Remove after Drop</label
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-6 col-12">
                            <div class="card card-default">
                                <div class="card-header">
                                    <h4 class="card-title">Create Event</h4>
                                </div>
                                <div class="card-body">
                                    <div class="input-group mb-2">
                                        <input
                                            class="form-control"
                                            type="text"
                                            placeholder="Event name..."
                                            v-model="evNewName"
                                        />
                                        <div class="input-group-btn">
                                            <button
                                                class="btn btn-secondary"
                                                v-on:click="addNewExternalEvent"
                                                type="button"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-muted"><small>Choose a Color</small></p>
                                    <ul class="list-inline" id="external-event-color-selector">
                                        <li v-for="evc in evColors" class="list-inline-item p-0">
                                            <div
                                                :class="
                                                    'circle circle-xl ' + getEvColorClasses(evc)
                                                "
                                                v-on:click="selectColor(evc)"
                                            ></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div v-if="selectedEvent">
                            <p>Selected:</p>
                            <div class="box-placeholder">{{ JSON.stringify(selectedEvent) }}</div>
                        </div>
                        <div v-if="!selectedEvent">
                            <p>Click calendar to show information</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-9 col-lg-8">
                    <div class="card card-default">
                        <div class="card-body">
                            <FullCalendar
                                defaultView="dayGridMonth"
                                :plugins="calendarPlugins"
                                :events="calendarEvents"
                                :themeSystem="'bootstrap'"
                                :header="calendarHeader"
                                :editable="true"
                                :droppable="true"
                                :deepChangeDetection="true"
                                @dateClick="dayClick"
                                @eventReceive="handleEventReceive"
                            >
                            </FullCalendar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/bootstrap/main.css';

import events from './Calendar.events';

const evColors = [
    'danger',
    'primary',
    'info',
    'success',
    'warning',
    'green',
    'pink',
    'inverse',
    'purple'
];

export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            evColors,
            selectedEvent: null,
            evRemoveOnDrop: false,
            evSelectedColor: evColors[0],
            evNewName: '',
            externalEvents: [
                { color: 'green', name: 'Lunch' },
                { color: 'danger', name: 'Go home' },
                { color: 'info', name: 'Do homework' },
                { color: 'warning', name: 'Work on UI design' },
                { color: 'inverse', name: 'Sleep tight' }
            ],
            calendarEvents: events,
            calendarPlugins: [
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                bootstrapPlugin
            ],
            calendarHeader: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }
        };
    },
    mounted() {
        /* initialize the external events */
        new Draggable(this.$refs.externalEventsList, {
            itemSelector: '.fce-event',
            eventData: function(eventEl) {
                return {
                    title: eventEl.innerText.trim()
                };
            }
        });
    },
    methods: {
        addRandomEvent() {
            // add dynamically an event
            this.addEvent({
                title: 'Random Event',
                start: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    Math.random() * (30 - 1) + 1
                ),
                backgroundColor: '#c594c5', //purple
                borderColor: '#c594c5' //purple
            });
        },

        dayClick(date) {
            this.selectedEvent = {
                date: date.dateStr
            };
        },

        // add event directly into calendar
        addEvent(event) {
            this.calendarEvents.push(event);
        },

        handleEventReceive(info) {
            var styles = getComputedStyle(info.draggedEl);
            info.event.setProp('backgroundColor', styles.backgroundColor);
            info.event.setProp('borderColor', styles.borderColor);

            // is the "remove after drop" checkbox checked?
            if (this.evRemoveOnDrop) {
                this.removeExternalEvent(info.draggedEl.textContent.trim());
            }
        },

        getEvColorClasses(evcolor) {
            return 'bg-' + evcolor + (this.evSelectedColor === evcolor ? ' selected' : '');
        },

        addNewExternalEvent() {
            const externalEvents = this.externalEvents.concat({
                color: this.evSelectedColor,
                name: this.evNewName.trim()
            });

            this.externalEvents = externalEvents;
        },

        removeExternalEvent(name) {
            let externalEvents = [...this.externalEvents];
            const index = externalEvents.findIndex(e => e.name === name);
            if (index > -1) {
                externalEvents.splice(index, 1);
                this.externalEvents = externalEvents;
            }
        },

        selectColor(color) {
            this.evSelectedColor = color;
        }
    }
};
</script>
